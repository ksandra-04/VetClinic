using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;

namespace VetClinic.DataAccess.Repositories;

public class OwnerRepository : GenericRepository<Owner>, IOwnerRepository
{
    public OwnerRepository(VetDbContext context) : base(context) { }

    public async Task<Owner?> GetByIdWithPetsAsync(int id)
        => await _dbSet
            .Include(o => o.Pets)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<IEnumerable<Owner>> GetAllWithPetsAsync()
        => await _dbSet
            .Include(o => o.Pets)
            .ToListAsync();
}