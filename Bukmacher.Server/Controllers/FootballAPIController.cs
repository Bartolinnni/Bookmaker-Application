using System.Data;
using Bukmacher.Database;
using Bukmacher.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestSharp;
using System.Net.Http;
using Bukmacher.Server.Models.API;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Bukmacher.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FootballApiController : ControllerBase
    {
        private readonly ILogger<FootballApiController> _logger;
        private readonly DataContext _dataContext;
        private readonly IConfiguration Configuration;
        private readonly string ApiUrl = "https://api-football-v1.p.rapidapi.com";
        private readonly RestClient _client;
        private readonly string ApiToken;
        public FootballApiController(ILogger<FootballApiController> logger, DataContext dataContext, IConfiguration configuration)
        {
            _logger = logger;
            _dataContext = dataContext;
            _client = new RestClient(new Uri(ApiUrl));
            Configuration = configuration;
            ApiToken = Configuration["ConnectionStrings:ApiToken"];
        }

        [HttpGet]
        [Route("DownloadFutureGames")] 
        public async Task<IActionResult> DownloadFutureGames(string leaugeId)
        {
            var request = new RestRequest("/v3/fixtures", Method.Get);
            request.AddParameter("league", leaugeId);
            request.AddParameter("next", 50);
            request.AddHeader("X-RapidAPI-Key", ApiToken);
            request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");
    
            //var response = await _client.ExecuteAsync(request);
            var response = await 
                System.IO.File.ReadAllTextAsync(
                    "C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");
            
            if (response == null) //|| !response.IsSuccessful
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(response);
        }
        [HttpGet]
        [Route("DownloadLiveGames")] 
        public async Task<IActionResult> DownloadLiveGames(string leaugeId)
        {
            var request = new RestRequest("/v3/fixtures", Method.Get);
            request.AddParameter("league", leaugeId);
            request.AddParameter("live", "all");
            request.AddHeader("X-RapidAPI-Key", ApiToken);
            request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");
    
            //var response = await _client.ExecuteAsync(request);
            var response =
                System.IO.File.ReadAllTextAsync(
                    "C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");
            
            if (response == null) //|| !response.IsSuccessful
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(response);
        }
        [HttpGet]
        [Route("DownloadSingleGame")] 
        public async Task<IActionResult> DownloadSingleGame(string gameId)
        {
            var request = new RestRequest("/v3/fixtures", Method.Get);
            request.AddParameter("game", gameId);
            request.AddHeader("X-RapidAPI-Key", ApiToken);
            request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");
    
            var response = await _client.ExecuteAsync(request);
            //var response =
                //System.IO.File.ReadAllTextAsync(
                    //"C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");
            
            if (response == null) //|| !response.IsSuccessful
                return BadRequest("Failed to fetch data from the API.");
            
            return Ok(response);
        }
    }
}
