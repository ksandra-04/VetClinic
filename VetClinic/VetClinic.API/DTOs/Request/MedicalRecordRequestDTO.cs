namespace VetClinic.API.DTOs.Request;

public class MedicalRecordRequestDTO
{
    public int AppointmentId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string? Observations { get; set; }
}