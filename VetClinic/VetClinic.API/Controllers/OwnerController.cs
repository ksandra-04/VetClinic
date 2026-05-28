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
public class OwnerController : ControllerBase
{
    private readonly IOwnerService _ownerService;
    private readonly IMapper _mapper;

    public OwnerController(IOwnerService ownerService, IMapper mapper)
    {
        _ownerService = ownerService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OwnerResponseDTO>>> GetAll()
    {
        var owners = await _ownerService.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<OwnerResponseDTO>>(owners));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OwnerResponseDTO>> GetById(int id)
    {
        try
        {
            var owner = await _ownerService.GetByIdAsync(id);
            return Ok(_mapper.Map<OwnerResponseDTO>(owner));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<ActionResult<OwnerResponseDTO>> Create([FromBody] OwnerRequestDTO dto)
    {
        var owner = _mapper.Map<Owner>(dto);
        await _ownerService.CreateAsync(owner);
        return CreatedAtAction(nameof(GetById), new { id = owner.Id }, _mapper.Map<OwnerResponseDTO>(owner));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OwnerRequestDTO dto)
    {
        try
        {
            await _ownerService.UpdateAsync(id, _mapper.Map<Owner>(dto));
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _ownerService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }
}