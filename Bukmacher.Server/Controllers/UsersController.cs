using Microsoft.AspNetCore.Mvc;
using Bukmacher.Core.FootballApiClient;
using Bukmacher.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public UsersController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet]
        [Route("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dataContext.Users.ToListAsync();

            if (users == null)
            {
                return BadRequest("There was an error during downloading data.");
            }

            return Ok(users);
        }
    }
}