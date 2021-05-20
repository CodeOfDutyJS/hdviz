import clearVisualization from '../../../model/d3/ClearVisualization';

window.document.body.innerHTML = '<svg '
  + 'id="area" '
  + 'style={{ '
  + 'height: "100%", '
  + 'width: |"100%", '
  + 'marginRight: "0px", '
  + 'marginLeft: "0px", '
  + '}} '
  + '>'
  + '<g></g>'
  + '</svg>';

describe('clearVisualization', () => {
  it('should clear the svg', () => {
    clearVisualization();
    expect(document.getElementById('area').childElementCount).toBe(0);
  });
});
