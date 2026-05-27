using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using VetClinic.API.DTOs.Request;
using VetClinic.API.DTOs.Response;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PetController : ControllerBase
{
    private readonly IPetService _petService;
    private readonly IMapper _mapper;

    public PetController(IPetService petService, IMapper mapper)
    {
        _petService = petService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PetResponseDTO>>> GetAll()
    {
        var pets = await _petService.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<PetResponseDTO>>(pets));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PetResponseDTO>> GetById(int id)
    {
        try
        {
            var pet = await _petService.GetByIdAsync(id);
            return Ok(_mapper.Map<PetResponseDTO>(pet));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("owner/{ownerId}")]
    public async Task<ActionResult<IEnumerable<PetResponseDTO>>> GetByOwner(int ownerId)
    {
        try
        {
            var pets = await _petService.GetByOwnerAsync(ownerId);
            return Ok(_mapper.Map<IEnumerable<PetResponseDTO>>(pets));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<ActionResult<PetResponseDTO>> Create([FromBody] PetRequestDTO dto)
    {
        try
        {
            var pet = _mapper.Map<Pet>(dto);
            await _petService.CreateAsync(pet);
            return CreatedAtAction(nameof(GetById), new { id = pet.Id }, _mapper.Map<PetResponseDTO>(pet));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PetRequestDTO dto)
    {
        try
        {
            await _petService.UpdateAsync(id, _mapper.Map<Pet>(dto));
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _petService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }
}