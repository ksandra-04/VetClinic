namespace VetClinic.Domain.Entities;

public abstract class AuditBase
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}