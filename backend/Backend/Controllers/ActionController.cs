using Citolab.Examenfeedback.Models;
using Citolab.Examenkompas.Backend.Helpers;
using Citolab.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Backend.Controllers
{
    [Route("api/[controller]")]
    public class ActionController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ActionController(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;

        }

        [HttpPost]
        public async Task AddUserActionAsync([FromBody] UserAction userAction)
        {
            userAction.CreatedByUserId = _httpContextAccessor.GetUserId();
            await _unitOfWork.GetCollection<UserAction>().AddAsync(userAction);
        }
    }
}
