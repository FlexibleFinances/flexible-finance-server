export function allAccess(req: any, res: any): void {
  res.status(200).send("Public Content.");
}

export function userBoard(req: any, res: any): void {
  res.status(200).send("User Content.");
}

export function adminBoard(req: any, res: any): void {
  res.status(200).send("Admin Content.");
}
