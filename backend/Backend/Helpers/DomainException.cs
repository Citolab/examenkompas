using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Backend.Helpers
{
    public class DomainException : Exception
    {
        public readonly int ErrorCode;
        public readonly DomainExceptionType DomainExceptionType;

        public DomainException(string message, DomainExceptionType type) : base(message)
        {
            DomainExceptionType = type;
        }

        public DomainException(int errorCode, string message, DomainExceptionType type) : base(message)
        {
            ErrorCode = errorCode;
            DomainExceptionType = type;
        }
    }

    public enum DomainExceptionType
    {
        NotFound,
        BadRequest,
        Unauthorized
    }
}
