import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";

export default function InfoTable({ time1, time2, diff, message, sync }) {
  return (
    <Table>
      <TableCaption>{message}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Player 1 Time</TableHead>
          <TableHead className="text-center">Difference</TableHead>
          <TableHead className="text-right">Player 2 Time</TableHead>
          <TableHead className="text-center">Sync</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-left">{time1}</TableCell>
          <TableCell className="text-center">{diff}</TableCell>
          <TableCell className="text-right">{time2}</TableCell>
          <TableCell className="text-center">{sync && "•"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
