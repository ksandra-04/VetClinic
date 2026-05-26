using VetClinic.Domain.Enums;

namespace VetClinic.Domain.Entities;

public class Pet : AuditBase
{
    public string Name { get; set; } = string.Empty;
    public PetType Type { get; set; }
    public string Breed { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public int OwnerId { get; set; }

    // Navigation Properties
    public Owner Owner { get; set; } = null!;
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}