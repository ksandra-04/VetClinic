using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;

namespace VetClinic.DataAccess.Repositories;

public class PetRepository : GenericRepository<Pet>, IPetRepository
{
    public PetRepository(VetDbContext context) : base(context) { }

    public async Task<Pet?> GetByIdWithDetailsAsync(int id)
        => await _dbSet
            .Include(p => p.Owner)
            .Include(p => p.Appointments)
                .ThenInclude(a => a.Veterinarian)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IEnumerable<Pet>> GetByOwnerAsync(int ownerId)
        => await _dbSet
            .Where(p => p.OwnerId == ownerId)
            .Include(p => p.Owner)
            .ToListAsync();

    public async Task<IEnumerable<Pet>> GetAllWithDetailsAsync()
        => await _dbSet
            .Include(p => p.Owner)
            .Include(p => p.Appointments)
            .ToListAsync();
}