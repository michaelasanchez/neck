﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public class Notes
    {
        public static int Count = 12;

        public static int Normalize(int n)
		{
            return (n + Count) % Count;
		}
    }
}
