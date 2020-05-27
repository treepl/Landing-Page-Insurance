<link media="all" rel="stylesheet" href="/cms-assets/css/event-calendar.min.css">
<script src="/cms-assets/js/event-calendar.min.js?v=20190515"></script>
<treepl_calendar class="calendar_treepl" data-event_group="{{eventGroup}}" data-group="{{group}}"  data-module_id="{{moduleId}}" data-category="{{category}}">
</treepl_calendar>
<script>
    createEventCalendarHolder('[calendarID]', '[rootFolderId]', '[featuresflag]');
</script>
{% assign category = null %}
{% assign eventGroup = null %}
{% assign group = null %}
{% assign moduleId = null %}