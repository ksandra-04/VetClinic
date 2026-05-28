using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VetClinic.API.DTOs.Request;
using VetClinic.API.DTOs.Response;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VeterinarianController : ControllerBase
{
    private readonly IVeterinarianService _veterinarianService;
    private readonly IMapper _mapper;

    public VeterinarianController(IVeterinarianService veterinarianService, IMapper mapper)
    {
        _veterinarianService = veterinarianService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VeterinarianResponseDTO>>> GetAll()
    {
        var vets = await _veterinarianService.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<VeterinarianResponseDTO>>(vets));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VeterinarianResponseDTO>> GetById(int id)
    {
        try
        {
            var vet = await _veterinarianService.GetByIdAsync(id);
            return Ok(_mapper.Map<VeterinarianResponseDTO>(vet));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<ActionResult<VeterinarianResponseDTO>> Create([FromBody] VeterinarianRequestDTO dto)
    {
        var vet = _mapper.Map<Veterinarian>(dto);
        await _veterinarianService.CreateAsync(vet);
        return CreatedAtAction(nameof(GetById), new { id = vet.Id }, _mapper.Map<VeterinarianResponseDTO>(vet));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] VeterinarianRequestDTO dto)
    {
        try
        {
            await _veterinarianService.UpdateAsync(id, _mapper.Map<Veterinarian>(dto));
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _veterinarianService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}