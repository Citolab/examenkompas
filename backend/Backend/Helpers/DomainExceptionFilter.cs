using Citolab.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Citolab.Examenkompas.Backend.Helpers
{
    public class DomainExceptionFilter : ExceptionFilterAttribute
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public DomainExceptionFilter(ILoggerFactory loggerFactory, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _logger = loggerFactory.CreateLogger<DomainExceptionFilter>();
        }

        public override void OnException(ExceptionContext context)
        {
            var domainExceptions = new List<DomainException>();
            if (context.Exception is DomainException)
            {
                domainExceptions.Add((DomainException)context.Exception);
            }

            if (context.Exception is AggregateException exception)
            {
                domainExceptions.AddRange(exception.InnerExceptions
                    .OfType<DomainException>().ToList());
            }

            if (domainExceptions.Any())
            {
                var messages = domainExceptions.Select(e => new { e.ErrorCode, e.Message });
                var unauthorized = domainExceptions.Any(e => e.DomainExceptionType == DomainExceptionType.Unauthorized);
                foreach (var domainException in domainExceptions)
                {
                    _logger.LogWarning(0,
                        $"A domain exception (${domainException.ErrorCode}) was thrown: {domainException.Message}. The request that caused it was '{domainException.DomainExceptionType}'",
                        domainException);
                }

                if (unauthorized)
                {
                    context.Result = new UnauthorizedObjectResult(messages);
                }
                else if (domainExceptions.Any(e => e.DomainExceptionType == DomainExceptionType.BadRequest))
                {
                    context.Result = new BadRequestObjectResult(messages);
                }
                else
                {
                    context.Result = new NotFoundObjectResult(messages);
                }
            }

            base.OnException(context);
        }
    }
}
