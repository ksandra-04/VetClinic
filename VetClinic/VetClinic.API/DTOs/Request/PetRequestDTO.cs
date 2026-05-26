using VetClinic.Domain.Enums;

namespace VetClinic.API.DTOs.Request;

public class PetRequestDTO
{
    public string Name { get; set; } = string.Empty;
    public PetType Type { get; set; }
    public string Breed { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public int OwnerId { get; set; }
}