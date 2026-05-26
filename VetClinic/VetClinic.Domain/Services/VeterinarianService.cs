using Microsoft.Extensions.Logging;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.Domain.Services;

public class VeterinarianService : IVeterinarianService
{
    private readonly IVeterinarianRepository _veterinarianRepository;
    private readonly ILogger<VeterinarianService> _logger;

    public VeterinarianService(IVeterinarianRepository veterinarianRepository, ILogger<VeterinarianService> logger)
    {
        _veterinarianRepository = veterinarianRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Veterinarian>> GetAllAsync()
        => await _veterinarianRepository.GetAllAsync();

    public async Task<Veterinarian> GetByIdAsync(int id)
    {
        var vet = await _veterinarianRepository.GetByIdAsync(id);
        if (vet == null)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {id}");
        return vet;
    }

    public async Task CreateAsync(Veterinarian veterinarian)
    {
        veterinarian.CreatedAt = DateTime.UtcNow;
        _logger.LogInformation("Creando veterinario: {FirstName} {LastName}", veterinarian.FirstName, veterinarian.LastName);
        await _veterinarianRepository.CreateAsync(veterinarian);
    }

    public async Task UpdateAsync(int id, Veterinarian veterinarian)
    {
        var existing = await _veterinarianRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {id}");

        existing.FirstName = veterinarian.FirstName;
        existing.LastName = veterinarian.LastName;
        existing.Specialty = veterinarian.Specialty;
        existing.LicenseNumber = veterinarian.LicenseNumber;
        existing.Phone = veterinarian.Phone;
        existing.UpdatedAt = DateTime.UtcNow;

        await _veterinarianRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        var vet = await _veterinarianRepository.GetByIdAsync(id);
        if (vet == null)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {id}");
        await _veterinarianRepository.DeleteAsync(id);
    }
}