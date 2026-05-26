using VetClinic.Domain.Enums;

namespace VetClinic.API.DTOs.Response;

public class AppointmentResponseDTO
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string OwnerFullName { get; set; } = string.Empty;
    public int VeterinarianId { get; set; }
    public string VeterinarianFullName { get; set; } = string.Empty;
    public string VeterinarianSpecialty { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public AppointmentStatus Status { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool HasMedicalRecord { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}