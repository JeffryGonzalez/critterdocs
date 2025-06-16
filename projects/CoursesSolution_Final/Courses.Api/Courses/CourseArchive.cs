using System.Linq.Expressions;
using JasperFx.Events;
using Marten.Events.Aggregation;
using Marten.Linq;
using Wolverine.Http;

namespace Courses.Api.Courses;

public record CourseHistory
{
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int NumberOfDays { get; set; }
    public InstructorAssignment? CurrentInstructor { get; set; }
    public InstructorAssignment[] PreviousInstructors { get; set; } = [];
    public DateTimeOffset DateCreated { get; set; }
    public DateTimeOffset? DateDeleted { get; set; } = null;
}

public record InstructorAssignment(string Instructor, DateTimeOffset DateAssigned);

public class CourseHistoryProjection : SingleStreamProjection<CourseHistory, Guid>
{
    public static CourseHistory Create(IEvent<CourseCreated> evt)
    {
        return new CourseHistory
        {
            Title = evt.Data.Title,
            Description = evt.Data.Description,
            NumberOfDays = evt.Data.NumberOfDays,
            DateCreated = evt.Timestamp,
            DateDeleted = null
        };
    }

    public static CourseHistory Apply(IEvent<CourseDeleted> evt, CourseHistory course) =>
        course with { DateDeleted = evt.Timestamp };

    public static CourseHistory Apply(IEvent<InstructorAssignedToCourse> evt, CourseHistory course)
    {
        var oldInstructor = course.CurrentInstructor;
        var previousInstructors = course.PreviousInstructors.ToList();
        if (oldInstructor is not null)
        {
            previousInstructors = [oldInstructor, ..previousInstructors];
        }

        return course with
        {
            CurrentInstructor = new InstructorAssignment(evt.Data.Instructor, evt.Timestamp),
            PreviousInstructors = previousInstructors.ToArray()
        };
    }
}

public static class CourseArchive
{
    [WolverineGet("/api/course-archive")]
    public static CourseArchiveCompiledQuery Get()
    {
        return new CourseArchiveCompiledQuery();
    }
}

public class CourseArchiveCompiledQuery : ICompiledListQuery<CourseHistory>
{
    public Expression<Func<IMartenQueryable<CourseHistory>, IEnumerable<CourseHistory>>> QueryIs()
    {
        return q => q.OrderByDescending(c => c.DateCreated);
    }
}