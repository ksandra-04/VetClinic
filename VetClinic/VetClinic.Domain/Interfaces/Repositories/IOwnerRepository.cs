using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Repositories;

public interface IOwnerRepository : IGenericRepository<Owner>
{
    Task<Owner?> GetByIdWithPetsAsync(int id);
    Task<IEnumerable<Owner>> GetAllWithPetsAsync();
}