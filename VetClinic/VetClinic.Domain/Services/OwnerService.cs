using Microsoft.Extensions.Logging;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.Domain.Services;

public class OwnerService : IOwnerService
{
    private readonly IOwnerRepository _ownerRepository;
    private readonly ILogger<OwnerService> _logger;

    public OwnerService(IOwnerRepository ownerRepository, ILogger<OwnerService> logger)
    {
        _ownerRepository = ownerRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Owner>> GetAllAsync()
        => await _ownerRepository.GetAllWithPetsAsync();

    public async Task<Owner> GetByIdAsync(int id)
    {
        var owner = await _ownerRepository.GetByIdWithPetsAsync(id);
        if (owner == null)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {id}");
        return owner;
    }

    public async Task CreateAsync(Owner owner)
    {
        owner.CreatedAt = DateTime.UtcNow;
        _logger.LogInformation("Creando dueño: {FirstName} {LastName}", owner.FirstName, owner.LastName);
        await _ownerRepository.CreateAsync(owner);
    }

    public async Task UpdateAsync(int id, Owner owner)
    {
        var existing = await _ownerRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {id}");

        existing.FirstName = owner.FirstName;
        existing.LastName = owner.LastName;
        existing.Phone = owner.Phone;
        existing.Email = owner.Email;
        existing.Address = owner.Address;
        existing.UpdatedAt = DateTime.UtcNow;

        await _ownerRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        var owner = await _ownerRepository.GetByIdWithPetsAsync(id);
        if (owner == null)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {id}");

        if (owner.Pets.Any())
            throw new InvalidOperationException("No se puede eliminar un dueño que tiene mascotas registradas");

        await _ownerRepository.DeleteAsync(id);
    }
}