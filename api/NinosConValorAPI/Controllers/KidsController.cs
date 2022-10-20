﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;
using NinosConValorAPI.Exceptions;
using NinosConValorAPI.Models;
using NinosConValorAPI.Services;
using System.Security.Cryptography;


namespace NinosConValorAPI.Controllers
{
    [Route("api/kids")]
    public class KidsController : ControllerBase
    {
        private IKidService _kidService;

        public KidsController(IKidService kidService)
        {
            _kidService = kidService;
        }

        [HttpPost]
        public async Task<ActionResult<KidModel>> CreateKidAsync([FromBody] KidModel kid)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var newKid = await _kidService.CreateKidAsync(kid);
                return Created($"/api/kids/{newKid.Id}", newKid);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happened.");
            }
        }
        [HttpGet("{kidId:int}")]
        public async Task<ActionResult<KidModel>> GetKidAync(int kidId)
        {
            try
            {
                var kid = await _kidService.GetKidAsync(kidId);
                return Ok(kid);
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happened.");
            }
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KidModel>>> GetKidsAync()
        {   
            try
            {
                return Ok (await _kidService.GetKidsAsync());
            }
            catch (BadRequestOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [HttpPut("{kidId:int}")]
        public async Task<IActionResult> UpdateKidAsync(int kidId, [FromBody] KidModel kidModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    foreach (var pair in ModelState)
                    {
                        if (pair.Key == nameof(kidModel.FirstName) && pair.Value.Errors.Count > 0)
                        {
                            return BadRequest(pair.Value.Errors);
                        }
                    }
                }

                return Ok(await _kidService.UpdateKidAsync(kidId, kidModel));
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }
    }

}
