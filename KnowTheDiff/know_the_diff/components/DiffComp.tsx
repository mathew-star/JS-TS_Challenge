'use client';

import { useState, FormEvent, ChangeEvent, useMemo } from 'react';

//import diff from '../utils/diff_helper'
import DiffViewer from './DiffViewer';
//import { DiffOp } from '../Types';
import { lineDiff, LineDiffOp } from '@/utils/line_diff';




export default function DiffComp() {
  const [str1, setStr1] = useState<string>('');
  const [str2, setStr2] = useState<string>('');
  const [diffOps, setDiffOps] = useState<LineDiffOp[]>([]);
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

      const string_diff = lineDiff(str1, str2);
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
        <div className='flex gap-3 mb-3'>
          <textarea
            type="text"
            value={str1}
            onChange={(e) => setStr1(e.target.value)}
            className="p-3 border"
            placeholder="First string"
            rows={4} cols={80}
          ></textarea>
          <textarea
            type="text"
            value={str2}
            onChange={(e) => setStr2(e.target.value)}
            className="p-3 border"
            placeholder="Second string"
            rows={4} cols={80}
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="bg-teal-100 text-black text-lg rounded p-3"
          >
            Submit
          </button>
        </div>

      </form>


      {diffOps.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Diff Result</h3>
          <DiffViewer diffOps={diffOps} />
        </div>
      )}
    </div>
  );
}
