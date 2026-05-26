namespace VetClinic.API.DTOs.Request;

public class AppointmentRequestDTO
{
    public int PetId { get; set; }
    public int VeterinarianId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
}