using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Services;

public interface IPetService
{
    Task<IEnumerable<Pet>> GetAllAsync();
    Task<Pet> GetByIdAsync(int id);
    Task<IEnumerable<Pet>> GetByOwnerAsync(int ownerId);
    Task CreateAsync(Pet pet);
    Task UpdateAsync(int id, Pet pet);
    Task DeleteAsync(int id);
}