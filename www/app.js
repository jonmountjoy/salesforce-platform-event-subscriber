var content = document.getElementById("content");
var mixes = [];

function renderEventList() {
  let html = '<div class="row"></div>';
  content.innerHTML = html;
}

function renderEvent(mix, isAnimated) {
  return `
        <div class="col-sm-12">
            <div class="panel panel-primary ${isAnimated ? "animateIn" : ""}">
                <div class="panel-heading">${mix.eventName}</div>
                <div class="panel-body">
                    <div class="col-md-12 col-lg-7">
                        <table>
                            <tr>
                                <td><pre>${JSON.stringify(
                                  mix.eventPayload,
                                  null,
                                  2
                                )}</pre></td>
                            </tr>
                        </table>
                    </div>
                    <div id="details-${mix.mixId}" class="col-md-12"></div>
                </div>
            </div>
        </div>`;
}

var socket = io.connect();

socket.on("eventReceived", function(newEvent) {
  mixes.push(newEvent);
  var el = document.createElement("div");
  el.className = "row";
  el.innerHTML = renderEvent(newEvent, true);
  content.insertBefore(el, content.firstChild);
});

renderEventList();
