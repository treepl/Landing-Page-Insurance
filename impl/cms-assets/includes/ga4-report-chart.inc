<script type="text/javascript" src="//www.gstatic.com/charts/loader.js"></script>
{% if requestJSON == "" %}
    {% capture requestJSON %}
        {"dimensions": [{"name": "date"}, {"name": "eventName"}],"metrics": [{"name": "eventCount"}],"dateRanges": [{"startDate": "{{startDate}}","endDate": "{{endDate}}"}],"dimensionFilter": {"andGroup": {"expressions": [{"filter": {"stringFilter": {"matchType": "EXACT","value": "{{eventName}}"},"fieldName": "eventName"}}]}},"limit": "100","orderBys": [{"dimension": {"orderType": "ALPHANUMERIC","dimensionName": "date"},"desc": false}],"keepEmptyRows": true}
    {% endcapture %}
{% endif %}
{% component type:"frontend_API", endpoint:"/api/frontend/ga4_run_report",  request: "{{requestJSON}}", layout:"", collectionVariable:"frontendAPIResponse" %}

{% if frontendAPIResponse.ErrorMessages == null %}
{% assign random = "" | unique_value : "n" %}
<div class="cms_chart-holder">
    <div class="chart-box">
        <div class="chart" id="chart_{{random}}"></div>
    </div>
    <div class="bottom-bar">
        <div class="bottom-bar-item">
            <input type="date" name="startDate">
        </div>
        <div class="bottom-bar-item">
            <input type="date" name="endDate">
        </div>
    </div>
</div>
<script>
    CMS_GA4_Analytics_Chart_{{random}}({{frontendAPIResponse}}, {{requestJSON}}, '{{random}}', '/api/frontend/ga4_run_report');

    function CMS_GA4_Analytics_Chart_{{random}}(c,b,p,q){function g(){const a=encodeURIComponent(JSON.stringify(b));fetch(q+"?request="+a,{method:"GET"}).then(function(a){return a.json()}).then(function(a){l(a.Response.Rows)})}function l(b){let c=[];a=new window.google.visualization.DataTable;a.addColumn("string","Date");a.addColumn("number",n);b.length?b.forEach((a)=>{const b=a.DimensionValues[0].Value.replace(/(\d{4})(\d{2})(\d{2})/ig,"$1-$2-$3");c.push([b,+a.MetricValues[0].Value])}):c.push([d.value,0]);a.addRows(c);
        e.draw(a,m)}let r=c.Response.Rows;const n=b.dimensionFilter.andGroup.expressions[0].filter.stringFilter.value,f=document.getElementById(`chart_${p}`);c=f.closest(".cms_chart-holder");const d=c.querySelectorAll('[name="startDate"]')[0],h=c.querySelectorAll('[name="endDate"]')[0],m={height:500,animation:{startup:!0,duration:1E3,easing:"out"},series:{0:{color:"#0091EA",axis:"left",lineWidth:2,targetAxisIndex:0,pointSize:3}},legend:{position:"top"},hAxis:{slantedText:!1},chartArea:{width:"90%",height:"85%"},
        isDefaultVisualization:!1};let e,a;d.value=b.dateRanges[0].startDate;d.max=b.dateRanges[0].endDate;h.value=b.dateRanges[0].endDate;h.min=b.dateRanges[0].startDate;window.google.charts.load("current",{packages:["corechart"]});window.google.charts.setOnLoadCallback(function(){e=new window.google.visualization.LineChart(f);l(r)});d.addEventListener("change",function(a){a=a.target.value;b.dateRanges[0].startDate=a;h.min=a;g()});h.addEventListener("change",function(a){a=a.target.value;b.dateRanges[0].endDate=
        a;d.max=a;g()})};
</script>
{% else %}
{{frontendAPIResponse.ErrorMessages}}
{% endif %}
