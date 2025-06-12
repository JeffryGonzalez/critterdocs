using Marten;
using Marten.Events.Aggregation;
using Microsoft.AspNetCore.Http.HttpResults;
using Wolverine.Http;
using Wolverine.Http.Marten;
using Wolverine.Marten;

namespace Courses.Api.Courses;

public record CreateCourseRequest(string Title, string Description, int NumberOfDays);

public record CreateCourseResponse(Guid Id, string Title, string Description, int NumberOfDays);

public record AssignInstructorToCourse(string Instructor);



// Events 

public record InstructorAssignedToCourse(string Instructor);
public record CourseCreated(string Title, string Description, int NumberOfDays);

public record CourseDeleted();

// Read Models

public record Course
{
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int NumberOfDays { get; set; }

    public string Instructor { get; set; } = string.Empty;
    
    
}

public class CourseProjection : SingleStreamProjection<Course, Guid>
{
    public static Course Create(CourseCreated evt)
    {
        return new Course
        {
            Title = evt.Title,
            Description = evt.Description,
            NumberOfDays = evt.NumberOfDays
        };
    }

   public static Course Apply(InstructorAssignedToCourse evt, Course course) => course with { Instructor = evt.Instructor };
    public bool ShouldDelete(CourseDeleted evt) => true;

}

public static class Api
{
    // GET /api/courses

    // POST /api/courses

    [WolverinePost("/api/courses")]
    public static (Created<CreateCourseResponse>, IStartStream) Post(CreateCourseRequest request)
    {

        var op = MartenOps.StartStream<Course>(new CourseCreated(request.Title, request.Description,
            request.NumberOfDays));
        var response = new CreateCourseResponse(
            Id: op.StreamId,
            Title: request.Title,
            Description: request.Description,
            NumberOfDays: request.NumberOfDays
        );
        var responseMessage = TypedResults.Created($"/api/courses/{response.Id}", response);
        return (responseMessage, op);
    }



    [WolverineGet("/api/courses/{id:guid}")]
    public static Course Get([ReadAggregate] Course course) => course;

    [WolverineGet("/api/courses")]
    public async static Task<Ok<IReadOnlyList<Course>>> Get(IDocumentSession session)
    {
        var response = await session.Query<Course>().ToListAsync();

        return TypedResults.Ok(response);
    }

    [WolverineDelete("/api/courses/{id:guid}"), EmptyResponse]
    public static CourseDeleted Delete([Aggregate] Course course) => new CourseDeleted();

    [WolverinePost("/api/courses/{id:guid}/instructor"), EmptyResponse]
    public static InstructorAssignedToCourse AssignInstructor([Aggregate] Course course, AssignInstructorToCourse req) => new InstructorAssignedToCourse(req.Instructor);
}