namespace VetClinic.Domain.Entities;

public class Veterinarian : AuditBase
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    // Navigation Properties
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}