using Bukmacher.Core.FootballApiClient;
using Bukmacher.Database;
using Bukmacher.Database.Models;
using Microsoft.AspNetCore.Mvc;
using Bukmacher.Server.Models.Dto;
using Bukmacher.Server.Helpers;
using Bukmacher.Server.Helpers.PointsCounter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupBetsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IPointsCounter _pointsCounter;
        private readonly IFootballApiClient _footballApiClient;
        public GroupBetsController(DataContext dataContext, IConfiguration configuration, IPointsCounter pointsCounter, IFootballApiClient footballApiClient)
        {
            _dataContext = dataContext;
            _pointsCounter = pointsCounter;
            _footballApiClient = footballApiClient;
        }

        [HttpPost]
        [Route("PostGroupBet")]
        public async Task<IActionResult> PostIndividualBet(AddGroupBetModel model)
        {
            try
            {
                var userId = _dataContext.Users
                    .Where(x => x.Email == model.userName)
                    .Select(x => x.Id)
                    .FirstOrDefault();
                
                if (userId == null)
                    return BadRequest("User with this username do not exists");
                
                var homeTeam = _dataContext.Teams.FirstOrDefault(t => t.ExternalId == model.Game.TeamHomeId);
                if (homeTeam == null)
                {
                    homeTeam = new Team()
                    {
                        ExternalId = model.Game.TeamHomeId,
                        Name = model.Game.TeamHomeName,
                        Logo = model.Game.TeamHomeLogo
                    };
                    _dataContext.Teams.Add(homeTeam);
                }

                var awayTeam = _dataContext.Teams.FirstOrDefault(t => t.ExternalId == model.Game.TeamAwayId);
                if (awayTeam == null)
                {
                    awayTeam = new Team()
                    {
                        ExternalId = model.Game.TeamAwayId,
                        Name = model.Game.TeamAwayName,
                        Logo = model.Game.TeamAwayLogo
                    };
                    _dataContext.Teams.Add(awayTeam);
                }

                await _dataContext.SaveChangesAsync();

                var game = _dataContext.Matches.FirstOrDefault(m => m.ExternalId == model.Game.GameId);
                if (game == null)
                {
                    game = new Match()
                    {
                        ExternalId = model.Game.GameId,
                        HomeTeamId = homeTeam.Id,
                        HomeTeam = homeTeam,
                        AwayTeamId = awayTeam.Id,
                        AwayTeam = awayTeam,
                        MatchDate = model.Game.Date
                    };
                    
                    _dataContext.Matches.Add(game);
                }
                await _dataContext.SaveChangesAsync();

                var groupBets = model.groupsId.Select(groupId => new GroupBet()
                {
                    PredictedHomeTeamScore = model.homeScore,
                    PredictedAwayTeamScore = model.awayScore,
                    Match = game,
                    UserId = userId,
                    GroupId = groupId
                }).ToList();

                await _dataContext.GroupBets.AddRangeAsync(groupBets);
                await _dataContext.SaveChangesAsync();
                
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
