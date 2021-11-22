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
  void Template.create({
    name: req.body.name,
    type: req.body.type,
  })
    .then((result) => {
      res.status(200).send({ message: "Template created." });
    })
    .catch((err: Error) => {
      res.status(500).send({ message: err.message });
    });
}
