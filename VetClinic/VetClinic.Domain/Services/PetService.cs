using Microsoft.Extensions.Logging;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Enums;
using VetClinic.Domain.Interfaces.Repositories;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.Domain.Services;

public class PetService : IPetService
{
    private readonly IPetRepository _petRepository;
    private readonly IOwnerRepository _ownerRepository;
    private readonly ILogger<PetService> _logger;

    public PetService(IPetRepository petRepository, IOwnerRepository ownerRepository, ILogger<PetService> logger)
    {
        _petRepository = petRepository;
        _ownerRepository = ownerRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Pet>> GetAllAsync()
    => await _petRepository.GetAllWithDetailsAsync();

    public async Task<Pet> GetByIdAsync(int id)
    {
        var pet = await _petRepository.GetByIdWithDetailsAsync(id);
        if (pet == null)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {id}");
        return pet;
    }

    public async Task<IEnumerable<Pet>> GetByOwnerAsync(int ownerId)
    {
        var ownerExists = await _ownerRepository.ExistsAsync(ownerId);
        if (!ownerExists)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {ownerId}");
        return await _petRepository.GetByOwnerAsync(ownerId);
    }

    public async Task CreateAsync(Pet pet)
    {
        var ownerExists = await _ownerRepository.ExistsAsync(pet.OwnerId);
        if (!ownerExists)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {pet.OwnerId}");

        pet.CreatedAt = DateTime.UtcNow;
        _logger.LogInformation("Creando mascota: {Name} para dueño {OwnerId}", pet.Name, pet.OwnerId);
        await _petRepository.CreateAsync(pet);
    }

    public async Task UpdateAsync(int id, Pet pet)
    {
        var existing = await _petRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {id}");

        var ownerExists = await _ownerRepository.ExistsAsync(pet.OwnerId);
        if (!ownerExists)
            throw new KeyNotFoundException($"No se encontró el dueño con ID {pet.OwnerId}");

        existing.Name = pet.Name;
        existing.Type = pet.Type;
        existing.Breed = pet.Breed;
        existing.BirthDate = pet.BirthDate;
        existing.OwnerId = pet.OwnerId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _petRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        var pet = await _petRepository.GetByIdWithDetailsAsync(id);
        if (pet == null)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {id}");

        var hasActiveAppointments = pet.Appointments.Any(a =>
            a.Status == AppointmentStatus.Scheduled ||
            a.Status == AppointmentStatus.InProgress);

        if (hasActiveAppointments)
            throw new InvalidOperationException("No se puede eliminar una mascota con citas activas (Scheduled o InProgress)");

        await _petRepository.DeleteAsync(id);
    }
}