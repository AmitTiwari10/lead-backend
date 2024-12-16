const Lead = require("../models/lead");
const User = require("../models/user");
const crypto = require("crypto");

exports.lead = (req, res) => {
  // console.log(req.body);
  User.findOne({ _id: req.body._id }).exec((err, user) => {
    if (user) {
      console.log("🚀 ~ User.findOne ~ user:", user)
      const {
        leadId,
        business_name,
        industry,
        contact_person,
        contact_email,
        contact_number,
        service_type,
        service_subtype,
        region,
        status,
        notes,
      } = req.body;

      const newLead = new Lead({
        leadId: "SLD-" + crypto.randomBytes(4).toString("hex"),
        business_name,
        industry,
        contact_person,
        contact_email,
        contact_number,
        service_type,
        service_subtype,
        region,
        status,
        notes,
        created_by: `${user.firstname} ${user.lastname}`,
        creator_email: user.email,
        creator_ekno: user.ekno,
        creator_department: user.department,
        creator_position: user.role,
      });

      newLead.save((err, data) => {
        if (err) {
          return res.status(400).json({
            message: err,
          });
        } else {
          return res.status(201).json({
            message: "lead created Successfully lead ID is:",
          });
        }
      });
    }
  });
};

exports.updateLead = (req, res) => {
  User.findOne({ _id: req.body._id }).exec((err, user) => {
    console.log("🚀 ~ User.findOne ~ user:", user)
    // if (user && user.access == "admin") {
      console.log("🚀 ~ Lead.findOne ~ req.body.leadId:", req.body.leadId)
      Lead.findOne({ leadId: req.body.leadId }).exec((err, lead) => {
        console.log("🚀 ~ Lead.findOne ~ lead:", lead)
        let creator_name = lead.created_by.split(" ");
        let capitalize_creator_name = `${creator_name[0][0]}${creator_name[0]
          .slice(1, creator_name[0].lenght)
          .toLowerCase()} ${creator_name[1][0]}${creator_name[1]
          .slice(1, creator_name[1].lenght)
          .toLowerCase()}`;
        let lead_creation_time = lead.createdAt.toLocaleString("en-US", {
          timeZone: "Africa/Nairobi",
        });
        let timeNow = new Date(Date.now());
        let commentTime = timeNow.toLocaleString("en-US", {
          timeZone: "Africa/Nairobi",
        });

        Lead.updateOne(
          { leadId: req.body.leadId, status: "OPEN" },
          {
            $set: {
              status: req.body.assign,
              notes:
                `${capitalize_creator_name}, ${lead_creation_time}:\n${lead.notes}` +
                "\n...............................................................\n" +
                `\n\n${user.firstname} ${user.lastname}, ${commentTime}:\n${req.body.notes}`,
              assigned_by: `${user.firstname} ${user.lastname}`,
              assignor_email: user.email,
              assignor_ekno: user.ekno,
              assignor_department: user.department,
              assignor_position: user.role,
              sales_person: req.body.sales_person,
              sales_person_email: req.body.sales_person_email,
              sales_person_ekno: req.body.sales_person_ekno,
              sales_person_department: req.body.sales_person_department,
              sales_person_position: req.body.sales_person_position,
            },
          },
          (err, res) => {
            if (err) throw err;
            return res;
            if (res.matchedCount == 0) {
              //fix how to return message back to html from this point.
            }
          }
        );
      });

      return res.status(200).json({
        message: "Lead updated successfully",
      });
    

    return res.status(400).json({
      message: "you need to be an admin to update lead",
    });
  });
};

exports.closeLead = (req, res, next) => {
  // console.log(req.body);
  User.findOne({ _id: req.body._id }).exec((err, user) => {
    if (user && user.access == "sales") {
      Lead.findOne({ leadId: req.body.leadId }).exec((err, lead) => {
        let timeNow = new Date(Date.now());
        let commentTime = timeNow.toLocaleString("en-US", {
          timeZone: "Africa/Nairobi",
        });

        Lead.updateOne(
          {
            leadId: req.body.leadId,
            status: "ASSIGNED",
            sales_person_email: user.email,
          },
          {
            $set: {
              status: "closed",
              notes:
                `${lead.notes}` +
                "\n..................................................................\n" +
                `\n\n${user.firstname} ${user.lastname}, ${commentTime}:\n${req.body.notes}`,
            },
          },
          (err, res) => {
            if (err) throw err;
            if (res.matchedCount == 0) {
              console.log("record not found");
              //fix how to return message back to html from this point.
            }
          }
        );
      });
      // return res.status(200).json({
      //   message: "Lead updated successfully",
      // });
    }

    // return res.status(400).json({
    //   message: "confirm you are owner of the lead",
    // });
  });
  next();
};

exports.getLeads = (req, res) => {
  Lead.find({}).exec((error, leads) => {
    if (error) return res.status(400).json({ error });
    if (leads) {
      return res.status(200).json(leads);
    }
  });
};

exports.leadStatus = (req, res, next) => {
  Lead.findOne({ leadId: req.body.leadId }).exec((error, lead) => {
    if (error) return res.status(400).json({ error });
    if (lead) {
      console.log(lead);
      return res.status(200).json(lead);
    }
  });
  next();
};

exports.getOneLead = (req, res) => {
  // console.log(req.query);
  Lead.findOne({ leadId: req.query.leadId }).exec((error, leads) => {
    if (error) return res.status(400).json({ error });
    if (leads) {
      return res.status(200).json(leads);
    }
  });
};

exports.getUsersRegion = (req, res) => {
  // console.log(req.query);
  User.find(
    { 
      // region: req.query.region, access: req.query.access,
      access:"sales",
       status: "active" },
    {
      email: 1,
      firstname: 1,
      lastname: 1,
      ekno: 1,
      department: 1,
      role: 1,
      region: 1,
    }
  ).exec((error, users) => {
    if (error) return res.status(400).json({ error });
    if (users) {
      // console.log(users);
      return res.status(200).json(users);
    }
  });
};

exports.getProductTotals = (req, res) => {
  Lead.find({}).exec((error, leads) => {
    if (error) return res.status(400).json({ error });
    if (leads) {
      // return res.status(200).json(leads);
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      const labelList = [];
      for (let lead of leads) {
        labelList.push(lead.service_type);
      }
      const serviceNames = labelList.filter(onlyUnique);

      const serviceData = [];
      for (let product of serviceNames) {
        serviceData.push(labelList.filter((i) => i === product).length);
      }
      const finalList = [];
      const keyPair = {};
      serviceNames.forEach((key, value) => (keyPair[key] = serviceData[value]));

      for (const [key, value] of Object.entries(keyPair)) {
        let dataPair = {};
        dataPair.label = key;
        dataPair.value = value;
        finalList.push(dataPair);
      }
      // console.log(finalList);
      return res.status(200).json(finalList);
    }
  });
};

exports.getSearchedLeads = (req, res) => {
  const region = req.query.region;
  const fromDate = req.query.fromDate;
  const status = req.query.status;
  const service = req.query.service_type;
  const toDate = req.query.toDate;
  const createdBy = req.query.created_by;
  Lead.find({
    createdAt: {
      $gte: fromDate,
      $lt: toDate,
    },
    region: {
      $regex: region,
      $options: "i",
    },
    status: {
      $regex: status,
      $options: "i",
    },
    service_type: {
      $regex: service,
      $options: "i",
    },
    created_by: {
      $regex: createdBy,
      $options: "i",
    },
  }).exec((error, leads) => {
    if (error) return res.status(400).json({ error });
    if (leads) {
      console.log(leads);
      return res.status(200).json(leads);
    }
  });
};
