namespace VetClinic.API.DTOs.Response;

public class MedicalRecordResponseDTO
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string VeterinarianFullName { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string? Observations { get; set; }
    public DateTime RecordDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}