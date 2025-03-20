using JasperFx.Core;
using Marten;
using Marten.Events;
using Shouldly;

namespace HelpDesk.Tests.Users;
public record UserCreated;
public record UserNameProvided(string UserName);
public record UserEmailProvided(string Email);
public record UserPhoneProvided(string Phone);
public enum UserContactPrefs { Phone, Email}
public record UserContactPrefsProvided(UserContactPrefs ContactPref);

public record User()
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public int Version { get; init; }
    
    public required DateTimeOffset CreatedOn { get; init; }
    public UserContactPrefs? ContactPreference { get; init; }

    public static User Create(IEvent<UserCreated> userCreated) => new() { CreatedOn = userCreated.Timestamp };

    public static User Apply(UserNameProvided userNameProvided, User user) =>
        user with { Name = userNameProvided.UserName };
    public static User Apply(UserEmailProvided userEmailProvided, User user) =>
        user with { Email = userEmailProvided.Email };
    public static User Apply(UserPhoneProvided userPhoneProvided, User user) =>
        user with { Phone = userPhoneProvided.Phone };
    public static User Apply(UserContactPrefsProvided userContactPrefsProvided, User user) =>
        user with { ContactPreference = userContactPrefsProvided.ContactPref };
}

public class Onboarding
{
    [Fact]
    public async Task HappyPath()
    {
        var store = DocumentStore.For(config =>
        {
            config.Connection("host=localhost;database=issues;password=password;username=user");
        });
        await using var session =  store.LightweightSession();
        var created = new UserCreated();
        var nameProvided = new UserNameProvided("John Doe");
        var emailProvided = new UserEmailProvided("john@aol.com");
        var phoneProvided = new UserPhoneProvided("(555) 555-1234");
        var contactPrefsProvided = new UserContactPrefsProvided(UserContactPrefs.Email);
        
        var userStreamId = Guid.NewGuid();
        session.Events.StartStream(userStreamId, created, nameProvided, emailProvided, phoneProvided, contactPrefsProvided);
        await session.SaveChangesAsync();
        
        var user = await session.Events.AggregateStreamAsync<User>(userStreamId);
        Assert.NotNull(user);
        Assert.Equal(user.Id, user.Id);
        Assert.Equal("John Doe", user.Name);
        Assert.Equal("john@aol.com", user.Email);
        Assert.Equal("(555) 555-1234", user.Phone);
        Assert.Equal(UserContactPrefs.Email, user.ContactPreference);
        Assert.Equal(5, user.Version);

        session.Events.Append(userStreamId, new UserContactPrefsProvided(UserContactPrefs.Phone));
        await session.SaveChangesAsync();
        
        var updatedUser = await session.Events
            .AggregateStreamAsync<User>(userStreamId);
        Assert.NotNull(updatedUser);
        Assert.Equal(UserContactPrefs.Phone, updatedUser.ContactPreference);
        Assert.Equal(6, updatedUser.Version);
    }

    [Fact]
    public async Task AddingCreatedOn()
    {
        var store = DocumentStore.For(config =>
        {
            config.Connection("host=localhost;database=issues;password=password;username=user");
        });
        await using var session =  store.LightweightSession();
        
        var userStreamId = Guid.NewGuid();
        
        session.Events.StartStream(userStreamId, new UserCreated());
        await session.SaveChangesAsync();
        var user = await session.Events.AggregateStreamAsync<User>(userStreamId);
        
        Assert.NotNull(user);
        user.CreatedOn.ShouldBe(DateTimeOffset.Now, 1.Seconds());
        
    }
}