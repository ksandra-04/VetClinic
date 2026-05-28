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
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly IMapper _mapper;

    public AppointmentController(IAppointmentService appointmentService, IMapper mapper)
    {
        _appointmentService = appointmentService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDTO>>> GetAll()
    {
        var appointments = await _appointmentService.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<AppointmentResponseDTO>>(appointments));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentResponseDTO>> GetById(int id)
    {
        try
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            return Ok(_mapper.Map<AppointmentResponseDTO>(appointment));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("pet/{petId}")]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDTO>>> GetByPet(int petId)
    {
        try
        {
            var appointments = await _appointmentService.GetByPetAsync(petId);
            return Ok(_mapper.Map<IEnumerable<AppointmentResponseDTO>>(appointments));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("veterinarian/{vetId}")]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDTO>>> GetByVeterinarian(int vetId)
    {
        try
        {
            var appointments = await _appointmentService.GetByVeterinarianAsync(vetId);
            return Ok(_mapper.Map<IEnumerable<AppointmentResponseDTO>>(appointments));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentResponseDTO>> Create([FromBody] AppointmentRequestDTO dto)
    {
        try
        {
            var appointment = _mapper.Map<Appointment>(dto);
            await _appointmentService.CreateAsync(appointment);
            return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, _mapper.Map<AppointmentResponseDTO>(appointment));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AppointmentRequestDTO dto)
    {
        try
        {
            await _appointmentService.UpdateAsync(id, _mapper.Map<Appointment>(dto));
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    // PATCH para cambiar el estado (máquina de estados)
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusDTO dto)
    {
        try
        {
            await _appointmentService.UpdateStatusAsync(id, dto.Status);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _appointmentService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }
}