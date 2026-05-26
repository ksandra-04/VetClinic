using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Repositories;

public interface IPetRepository : IGenericRepository<Pet>
{
    Task<Pet?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Pet>> GetByOwnerAsync(int ownerId);
}