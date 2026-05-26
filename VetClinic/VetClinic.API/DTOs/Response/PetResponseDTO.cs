using VetClinic.Domain.Enums;

namespace VetClinic.API.DTOs.Response;

public class PetResponseDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public PetType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public int OwnerId { get; set; }
    public string OwnerFullName { get; set; } = string.Empty;
    public int AppointmentsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}