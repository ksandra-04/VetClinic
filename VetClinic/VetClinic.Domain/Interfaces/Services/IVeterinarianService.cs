using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Services;

public interface IVeterinarianService
{
    Task<IEnumerable<Veterinarian>> GetAllAsync();
    Task<Veterinarian> GetByIdAsync(int id);
    Task CreateAsync(Veterinarian veterinarian);
    Task UpdateAsync(int id, Veterinarian veterinarian);
    Task DeleteAsync(int id);
}