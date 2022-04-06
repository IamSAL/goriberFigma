import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = `output-${new Date().getMilliseconds()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ExportOptions({ EditorState }) {
  const scales = [0.5, 1, 1.5, 2, 3, 4];
  const formats = ["JPEG", "PNG", "SVG", "PDF"];
  const {
    editor: { activeObject, allObjects },
    canvas,
  } = EditorState;

  function saveImage(e) {
    let href = canvas?.toDataURL({
      format: "png",
      quality: 0.8,
    });

    downloadImage(href);
  }

  return (
    <>
      <Formik
        initialValues={{
          scale: 1,
          name: activeObject?.name || "",
          format: "PNG",
        }}
        validationSchema={Yup.object({
          scale: Yup.string().required("Required"),
          name: Yup.string().required("Required"),
          format: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          saveImage();
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          errors,
          touched,
          values,
          handleChange,
        }) => (
          <Form>
            <TextField
              name="name"
              sx={{
                my: "10px",
                width: "100%",
              }}
              value={values.name}
              onChange={handleChange}
              placeholder="Name"
              inputProps={{ "aria-label": "name" }}
              label="File name"
              variant="standard"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FormControl variant="standard" sx={{ width: "30%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Scale
                </InputLabel>
                <Select
                  value={values.scale}
                  onChange={handleChange}
                  label="Scale"
                  name="scale"
                >
                  {scales.map((scale, idx) => {
                    return (
                      <MenuItem value={scale} key={idx}>
                        {scale}x
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ width: "70%" }}>
                <InputLabel id="demo-simple-select-filled-label">
                  Format
                </InputLabel>
                <Select
                  value={values.format}
                  onChange={handleChange}
                  name="format"
                >
                  {formats.map((format, idx) => {
                    return (
                      <MenuItem value={format} key={idx}>
                        {format}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="outlined"
              type="submit"
              startIcon={<ArrowCircleDownIcon />}
              sx={{
                my: "10px",
                width: "100%",
              }}
            >
              Export {activeObject?.name || "Item"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
