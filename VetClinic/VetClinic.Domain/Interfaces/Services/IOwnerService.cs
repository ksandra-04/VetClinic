using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Services;

public interface IOwnerService
{
    Task<IEnumerable<Owner>> GetAllAsync();
    Task<Owner> GetByIdAsync(int id);
    Task CreateAsync(Owner owner);
    Task UpdateAsync(int id, Owner owner);
    Task DeleteAsync(int id);
}