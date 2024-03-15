import { render, screen } from "@testing-library/react";
import App from "./App";

/*
test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

/*
 * Tests for 4 widgets :
 * Sidebar, Topbar, PDFViewer, DiagramViewer
 */
test("4 widgets", () => {
  render(<App />);
  const sidebar = screen.getByTestId("Sidebar");
  expect(sidebar).toBeInTheDocument();
  const topbar = screen.getByTestId("Topbar")
  expect(topbar).toBeInTheDocument();
  const pdfViewer = screen.getByTestId("PDFViewer");
  expect(pdfViewer).toBeInTheDocument();
  const diagramViewer = screen.getByTestId("DiagramViewer")
  expect(diagramViewer).toBeInTheDocument();
});

