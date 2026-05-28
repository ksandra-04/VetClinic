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
public class MedicalRecordController : ControllerBase
{
    private readonly IMedicalRecordService _medicalRecordService;
    private readonly IMapper _mapper;

    public MedicalRecordController(IMedicalRecordService medicalRecordService, IMapper mapper)
    {
        _medicalRecordService = medicalRecordService;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalRecordResponseDTO>> GetById(int id)
    {
        try
        {
            var record = await _medicalRecordService.GetByIdAsync(id);
            return Ok(_mapper.Map<MedicalRecordResponseDTO>(record));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("appointment/{appointmentId}")]
    public async Task<ActionResult<MedicalRecordResponseDTO>> GetByAppointment(int appointmentId)
    {
        try
        {
            var record = await _medicalRecordService.GetByAppointmentAsync(appointmentId);
            if (record == null) return NoContent();
            return Ok(_mapper.Map<MedicalRecordResponseDTO>(record));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<ActionResult<MedicalRecordResponseDTO>> Create([FromBody] MedicalRecordRequestDTO dto)
    {
        try
        {
            var record = _mapper.Map<MedicalRecord>(dto);
            await _medicalRecordService.CreateAsync(record);
            return CreatedAtAction(nameof(GetById), new { id = record.Id }, _mapper.Map<MedicalRecordResponseDTO>(record));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MedicalRecordRequestDTO dto)
    {
        try
        {
            await _medicalRecordService.UpdateAsync(id, _mapper.Map<MedicalRecord>(dto));
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _medicalRecordService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}