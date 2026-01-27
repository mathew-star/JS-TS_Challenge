'use client';

import { useState, FormEvent, ChangeEvent, useMemo } from 'react';

import diff from '../utils/diff_helper'
import { DiffOp } from '../Types';


export default function DiffComp() {
  const [str1, setStr1] = useState<string>('');
  const [str2, setStr2] = useState<string>('');
  const [diffOps, setDiffOps] = useState<DiffOp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');




  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setError('');
    setIsLoading(true);
    try {
      // Your comparison logic here, e.g., alert(str1 === str2);
      console.log('String 1:', str1);
      console.log('String 2:', str2);

      console.log("Finding Diff: ");

      const string_diff = diff(str1, str2);
      console.log(string_diff);
      setDiffOps(string_diff);
      console.log(diffOps);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div>
      <h2 className="text-xl mb-2">String Comparison</h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        <input
          type="text"
          value={str1}
          onChange={(e) => setStr1(e.target.value)}
          className="p-3 border"
          placeholder="First string"
        />
        <input
          type="text"
          value={str2}
          onChange={(e) => setStr2(e.target.value)}
          className="p-3 border"
          placeholder="Second string"
        />
        <button
          type="submit"
          className="bg-teal-100 text-black text-lg rounded p-3"
        >
          Submit
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="text-xl font-mono">
        {diffOps.map((op, idx) => {
          if (op.type === 'equal') {
            return <span key={idx}>{op.value}</span>;
          }

          if (op.type === 'add') {
            return (
              <span key={idx} className="text-green-600">
                {op.value}
              </span>
            );
          }

          return (
            <span key={idx} className="text-red-600 line-through">
              {op.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
