using Microsoft.AspNetCore.Mvc;
using Bukmacher.Core.FootballApiClient;
using Bukmacher.Database;
using Bukmacher.Database.Models;
using Bukmacher.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public GroupsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet]
        [Route("GetUserGroups")] 
        public async Task<IActionResult> GetUserGroups(string userName)
        {
            var userId = _dataContext.Users.Where(x => x.UserName == userName).Select(x => x.Id).FirstOrDefault();
            var userGroups = await _dataContext.Groups.Where(x => x.MembersId.Contains(userId) || x.OwnerId == userId).ToListAsync();

            if (userGroups == null)
            {
                return BadRequest("");
            }
            
            return Ok(userGroups);
        }
        [HttpPost]
        [Route("AddGroup")] 
        public async Task<IActionResult> AddGroup(AddGroupModel model)
        {
            var ownerId = _dataContext.Users.Where(x => x.UserName == model.OwnerName).Select(x => x.Id).FirstOrDefault();

            var newGroup = new Group()
            {
                Name = model.Name,
                OwnerId = ownerId,
                MembersId = model.MembersIds,
                Description = model.Description
            };

            _dataContext.Groups.Add(newGroup);
            await _dataContext.SaveChangesAsync();

            return Created(nameof(AddGroup), new { groupId = newGroup.Id });
        }
    }
}