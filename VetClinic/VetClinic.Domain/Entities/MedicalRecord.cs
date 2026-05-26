namespace VetClinic.Domain.Entities;

public class MedicalRecord : AuditBase
{
    public int AppointmentId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string? Observations { get; set; }
    public DateTime RecordDate { get; set; }

    // Navigation Properties
    public Appointment Appointment { get; set; } = null!;
}