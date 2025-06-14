import { parseArgs } from "./parse-args";

// describe('parseArgs', () => {
//   it('parses combined short flags like "-tg"', () => {
//     const args = ['-tg'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-t': '',
//       '-g': '',
//     });
//   });

//   it('parses single flags with values', () => {
//     const args = ['-f', 'test'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-f': 'test',
//       'test': '',
//     });
//   });

//   it('parses standalone flags without values', () => {
//     const args = ['-r'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-r': '',
//     });
//   });

//   it('parses a mixture of combined, single, and standalone values', () => {
//     const args = ['-tg', '-r', '-f', 'test', '-p', 'folder'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-t': '',
//       '-g': '',
//       '-r': '',
//       '-f': 'test',
//       'test': '',
//       '-p': 'folder',
//       'folder': '',
//     });
//   });

//   it('handles values that look like flags (should not be treated as flags)', () => {
//     const args = ['-f', '-value'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-f': '',
//       '-value': '',
//     });
//   });

//   it('parses repeated flags', () => {
//     const args = ['-a', '1', '-a', '2'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-a': '2', // last value wins
//       '2': '',
//     });
//   });

//   it('handles flag followed by another flag (no value)', () => {
//     const args = ['-x', '-y'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       '-x': '',
//       '-y': '',
//     });
//   });

//   it('parses standalone values not associated with a flag', () => {
//     const args = ['file.txt'];
//     const result = parseArgs(args);
//     expect(Object.fromEntries(result)).toEqual({
//       'file.txt': '',
//     });
//   });
// });
