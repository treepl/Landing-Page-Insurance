<script type="text/javascript" src="//www.gstatic.com/charts/loader.js"></script>
{% if requestJSON == "" %}
{% capture requestJSON %}{"startDate": "{{startDate}}","endDate": "{{endDate}}","filterExpression": [{"secureZones" : [{{secureZonesList}}]}],"sortExpression": [{"sortBy" : "date","sortOrder" : "ASC"}],"groupType" : "{{groupType | default : "Day"}}"}
{% endcapture %}
{% endif %}
{% component type:"frontend_API", endpoint:"/api/frontend/secure_zone_subscribers_analytics",  request: "{{requestJSON}}", layout:"", collectionVariable:"frontendAPIResponse" %}
{% if frontendAPIResponse.ErrorMessages == null %}
{% assign random = "" | unique_value : "n" %}
<div class="cms_chart-holder">
    <div class="chart-box">
        <div class="chart" id="chart_{{random}}"></div>
    </div>
    <div class="bottom-bar">
        <div class="bottom-bar-item">
            <select name="groupType">
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
            </select>
        </div>
        <div class="bottom-bar-item">
            <input type="date" name="startDate">
        </div>
        <div class="bottom-bar-item">
            <input type="date" name="endDate">
        </div>
    </div>
</div>
<script>
    CMS_Secure_Zone_Analytics_Chart_{{random}}({{frontendAPIResponse}}, {{requestJSON}}, '{{random}}', '/api/frontend/secure_zone_subscribers_analytics');

    function CMS_Secure_Zone_Analytics_Chart_{{random}}(c,b,p,q){function g(){const a=encodeURIComponent(JSON.stringify(b));fetch(q+"?request="+a,{method:"GET"}).then(function(a){return a.json()}).then(function(a){l(a.Response.Rows)})}function l(a){let b=[];const c=a[0].DimensionValues;e=new window.google.visualization.DataTable;c.forEach((a)=>{"Date"===a.Value?e.addColumn("string",a.Value):e.addColumn("number",a.Value)});a.forEach((a)=>{a=a.MetricValues;let c=[];var k=a[0].Value.replace(/(\d{4})(\d{2})(\d{2})/ig,
        "$1-$2-$3");c.push(k);for(k=1;k<a.length;k++)c.push(+a[k].Value);b.push(c)});e.addRows(b);m.draw(e,h)}let r=c.Response.Rows;const n=document.getElementById(`chart_${p}`);c=n.closest(".cms_chart-holder");const f=c.querySelectorAll('[name="startDate"]')[0],d=c.querySelectorAll('[name="endDate"]')[0];c=c.querySelectorAll('[name="groupType"]')[0];const h={height:500,animation:{startup:!0,duration:1E3,easing:"out"},series:{0:{color:"#0091EA",axis:"left",lineWidth:2,targetAxisIndex:0,pointSize:3}},legend:{position:"top"},
        hAxis:{slantedText:!1},chartArea:{width:"90%",height:"85%"},isDefaultVisualization:!1};let m,e;f.value=b.startDate;f.max=b.endDate;d.value=b.endDate;d.min=b.startDate;c.value=b.groupType;window.google.charts.load("current",{packages:["corechart"]});window.google.charts.setOnLoadCallback(function(){m=new window.google.visualization.LineChart(n);l(r)});f.addEventListener("change",function(a){a=a.target.value;b.startDate=a;d.min=a;g()});d.addEventListener("change",function(a){a=a.target.value;b.endDate=
        a;f.max=a;g()});c.addEventListener("change",function(a){b.groupType=a.target.value;g()})}
</script>

{% else %}
{{frontendAPIResponse.ErrorMessages}}
{% endif %}
