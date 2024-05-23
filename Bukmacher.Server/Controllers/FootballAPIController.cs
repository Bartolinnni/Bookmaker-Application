using Microsoft.AspNetCore.Mvc;
using Bukmacher.Core.FootballApiClient;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FootballApiController : ControllerBase
    {
        private readonly IFootballApiClient _footballApiClient;
        public FootballApiController(IFootballApiClient footballApiClient)
        {
            _footballApiClient = footballApiClient;
        }

        [HttpGet]
        [Route("DownloadFutureGames")] 
        public async Task<IActionResult> DownloadFutureGames(string leaugeId)
        {
            var fixtures = await _footballApiClient.DownloadFutureGames(leaugeId);
            
            if (fixtures == null)
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(fixtures);
        }
        [HttpGet]
        [Route("DownloadLiveGames")] 
        public async Task<IActionResult> DownloadLiveGames(string leaugeId)
        {
            var fixtures = await _footballApiClient.DownloadLiveGames(leaugeId);
            
            if (fixtures == null) //|| !response.IsSuccessful
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(fixtures);
        }
        [HttpGet]
        [Route("DownloadSingleGame")] 
        public async Task<IActionResult> DownloadSingleGame(string gameId)
        {
            var fixtures = await _footballApiClient.DownloadLiveGames(gameId);
            
            if (fixtures == null) //|| !response.IsSuccessful
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(fixtures);
        }
    }
}
