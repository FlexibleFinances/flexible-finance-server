import Template from "../../database/models/Template";

export function getTemplates(req: any, res: any): void {
  void Template.findAll()
    .then((templates) => {
      res.status(200).send({
        message: "Templates gotten.",
        templates: templates,
      });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}

export function createTemplate(req: any, res: any): void {
  if (req.body.name === undefined || req.body.type === undefined) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  void Template.create({
    name: req.body.name,
    type: req.body.type,
  })
    .then((newTemplate) => {
      res
        .status(200)
        .send({ message: "Template created.", template: newTemplate });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
