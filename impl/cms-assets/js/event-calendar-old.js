(function (w) {
    w.createEventCalendarHolder = function (calendarId, rootHolderId, featureFlag) {
        let calendarHolder = document.getElementById(calendarId),
            calendarParentWidth = calendarHolder.parentElement.offsetWidth,
            monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            currentDate = new Date(),
            currentYear = currentDate.getFullYear(),
            currentMonth = currentDate.getMonth(),
            elemId = `eventCalendar${currentDate.getTime()}`,
            calendarHolderContent = `<calendar_loader class="calendar_treepl_loader"><svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></calendar_loader><calendar_header class="calendar_treepl_header"><a href="javascript:" class="prev-month" onclick="goToEventCalendarPrevMonth('${elemId}', '${calendarId}', ${rootHolderId}, ${featureFlag})"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg></a><div class="active_month"><div class="active_month_select"><select class="selectMonthDrop" onchange="createEventCalendar('${elemId}', '${calendarId}', ${rootHolderId}, ${featureFlag})">`;

        if (calendarParentWidth <= 800 && calendarParentWidth > 400) {
            calendarHolder.classList.add('md-size');
        } else if (calendarParentWidth <= 400) {
            calendarHolder.classList.add('sm-size');
        }

        for (let i = 0; i < monthArr.length; i++) {
            calendarHolderContent += `<option value="${i}">${monthArr[i]}</option>`;
        }

        calendarHolderContent += `</select></div><div class="active_month_select"><select class="selectYearDrop" onchange="createEventCalendar('${elemId}', '${calendarId}', ${rootHolderId}, ${featureFlag})">`;

        for (let i = 0; i < 20; i++) {
            let dropYear = 2017 + i;
            calendarHolderContent += `<option value="${dropYear}">${dropYear}</option>`;
        }

        calendarHolderContent += `</select></div></div><a href="javascript:" class="next-month" onclick="goToEventCalendarNextMonth('${elemId}', '${calendarId}', ${rootHolderId}, ${featureFlag})"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg></a></calendar_header><calendar_treepl_body class="calendar_treepl_body" id="${elemId}"></calendar_treepl_body><calendar_modal style="display: none;" class="calendar_treepl_modal"></calendar_modal>`;

        calendarHolder.innerHTML = calendarHolderContent;
        calendarHolder.getElementsByClassName('selectMonthDrop')[0].value = currentMonth;
        calendarHolder.getElementsByClassName('selectYearDrop')[0].value = currentYear;

        window.addEventListener('resize', () => {
            calendarParentWidth = calendarHolder.parentElement.offsetWidth;
            calendarResize(calendarParentWidth);
        });

        calendarResize(calendarParentWidth);
        createEventCalendar(elemId, calendarId, rootHolderId, featureFlag);

        function calendarResize(parentWidth) {
            calendarHolder.classList.remove('md-size');
            calendarHolder.classList.remove('sm-size');

            if (parentWidth <= 800 && parentWidth > 400) {
                calendarHolder.classList.add('md-size');
            } else if (parentWidth <= 400) {
                calendarHolder.classList.add('sm-size');
            }
        }
    };

    w.openEventCalendarMobileModalWindow = function (_this, holderId) {
        let holder = document.getElementById(holderId);

        if (holder.parentElement.offsetWidth > 400) {
            return false;
        } else {
            let modal = holder.getElementsByClassName('calendar_treepl_modal')[0],
                eventListHolder = _this.getElementsByClassName('calendar_table_event_holder')[0],
                eventDate = new Date(+eventListHolder.dataset.time),
                dateOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                },
                eventsList = eventListHolder.getElementsByTagName('a'),
                modalInnerHtml = `<div class="calendar_treepl_modal_content"><div class="title-bar"><strong class="title">${eventDate.toLocaleString("en-US", dateOptions)}</strong><a href="javascript:" class="close" onclick="closeEventCalendarMobileModalWindow('${holderId}')"><svg fill="#9c9c9c" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" /></svg></a></div><div class="modal-events-holder"><div class="modal-events-list">`;

            for (let eventItem of eventsList) {
                if (eventItem.className.indexOf('clear') === -1) {
                    modalInnerHtml += `<div class="event"><a href="${eventItem.getAttribute('href')}">${eventItem.getAttribute('title')}</a></div>`;
                }

            }

            modalInnerHtml += `</div></div></div>`;
            modal.innerHTML = modalInnerHtml;
            modal.style.display = 'block';
        }
    };

    w.closeEventCalendarMobileModalWindow = function (holderId) {
        let modal = document.getElementById(holderId).getElementsByClassName('calendar_treepl_modal')[0];

        modal.style.display = 'none';
        modal.innerHTML = '';
    };

    w.goToEventCalendarPrevMonth = function (elemId, holderId, rootHolderId, featureFlag) {
        let holder = document.getElementById(holderId),
            selectMonthDrop = holder.getElementsByClassName('selectMonthDrop')[0],
            selectYearDrop = holder.getElementsByClassName('selectYearDrop')[0],
            currentMonth = +selectMonthDrop.value,
            currentYear = +selectYearDrop.value,
            newMonth = currentMonth - 1;

        if (currentMonth == 0 && currentYear == 2017) {
            return false;
        }

        if (newMonth == -1) {
            newMonth = 11;
            currentYear = currentYear - 1;
        }

        selectMonthDrop.value = newMonth;
        selectYearDrop.value = currentYear;
        createEventCalendar(elemId, holderId, rootHolderId, featureFlag);
    };

    w.goToEventCalendarNextMonth = function (elemId, holderId, rootHolderId, featureFlag) {
        let holder = document.getElementById(holderId),
            selectMonthDrop = holder.getElementsByClassName('selectMonthDrop')[0],
            selectYearDrop = holder.getElementsByClassName('selectYearDrop')[0],
            currentMonth = +selectMonthDrop.value,
            currentYear = +selectYearDrop.value,
            newMonth = currentMonth + 1;

        if (currentMonth == 11 && currentYear == +selectYearDrop.options[selectYearDrop.options.length - 1].value) {
            return false;
        }

        if (newMonth == 12) {
            newMonth = 0;
            currentYear = currentYear + 1;
        }

        selectMonthDrop.value = newMonth;
        selectYearDrop.value = currentYear;
        createEventCalendar(elemId, holderId, rootHolderId, featureFlag);
    };

    w.createEventCalendar = function (id, holderId, rootHolderId, featureFlag) {
        let elem = document.getElementById(id),
            holder = document.getElementById(holderId),
            calendarLoader = holder.getElementsByClassName('calendar_treepl_loader')[0],
            eventGroupId;

        if (featureFlag) {
            if(holder.dataset.group != '') {
                eventGroupId = holder.dataset.group != 0 ? holder.dataset.group : '';
            } else {
                if(holder.dataset.event_group == -1) {
                    eventGroupId = '';
                } else if(holder.dataset.event_group == rootHolderId) {
                    eventGroupId = -1;
                } else {
                    eventGroupId = holder.dataset.event_group;
                }
            }
        } else {
            eventGroupId = holder.dataset.event_group != -1 ? holder.dataset.event_group : '';
        }

        let moduleId = holder.dataset.module_id,
            category = encodeURIComponent(holder.dataset.category || ''),
            selectMonthDrop = holder.getElementsByClassName('selectMonthDrop')[0],
            selectYearDrop = holder.getElementsByClassName('selectYearDrop')[0],
            mon = +selectMonthDrop.value,
            year = +selectYearDrop.value,
            d = new Date(year, mon),
            currentDate = new Date(),
            ongoingDate = `${(mon + 1)}/1/${year}`,
            searchEventUrl = `?prop_ModuleId=${moduleId}&prop_ongoingDate=${ongoingDate}&prop_ParentId=${eventGroupId}&prop_ItemCategories=${category}&jsonResponse=1`,
            emptyEventColumn = `<div class="calendar_table_column"><div class="calendar_table_date other-month"><span></span></div><div class="calendar_table_event_holder"></div></div>`,
            eventCalendarTable = `<div class="calendar_table"><div class="calendar_table_head"><div class="calendar_table_row"><div class="calendar_table_column">Mon</div><div class="calendar_table_column">Tue</div><div class="calendar_table_column">Wed</div><div class="calendar_table_column">Thu</div><div class="calendar_table_column">Fri</div><div class="calendar_table_column">Sat</div><div class="calendar_table_column">Sun</div></div></div><div class="calendar_table_body"><div class="calendar_table_row">`,
            xhttp = new XMLHttpRequest();


        calendarLoader.style.display = 'flex';

        for (var i = 0; i < getDay(d); i++) {
            eventCalendarTable += emptyEventColumn;
        }

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let eventItems = JSON.parse(this.responseText).items;

                eventItems = eventItems.sort(function (a, b) {
                    return new Date(a.eventdatestart).getTime() - new Date(b.eventdatestart).getTime();
                });

                while (d.getMonth() == mon) {
                    let todayClass = '';
                    let dTime = d.getTime();

                    if (currentDate.getMonth() == d.getMonth() && currentDate.getDate() == d.getDate()) {
                        todayClass = 'today';
                    }
                    eventCalendarTable += `<div class="calendar_table_column" onclick="openEventCalendarMobileModalWindow(this, '${holderId}');"><div class="calendar_table_date ${todayClass}"><span>${d.getDate()}</span></div><div class="calendar_table_event_holder" data-time="${dTime}"></div></div>`;

                    if (getDay(d) % 7 == 6) {
                        eventCalendarTable += '</div><div class="calendar_table_row">';
                    }

                    d.setDate(d.getDate() + 1);
                }

                if (getDay(d) != 0) {
                    for (var i = getDay(d); i < 7; i++) {
                        eventCalendarTable += emptyEventColumn;
                    }
                }

                eventCalendarTable += '</div></div></div>';

                elem.innerHTML = eventCalendarTable;

                let calendarRows = elem.getElementsByClassName('calendar_table_row');

                for (let item of eventItems) {
                    let elStartTimeArr = item.eventdatestart.split(/[^0-9]/),
                        elEndTimeArr = item.eventdateend.split(/[^0-9]/),
                        elStartTime = new Date(elStartTimeArr[0], elStartTimeArr[1] - 1, elStartTimeArr[2], elStartTimeArr[3], elStartTimeArr[4], elStartTimeArr[5]).getTime(),
                        elEndTime = new Date(elEndTimeArr[0], elEndTimeArr[1] - 1, elEndTimeArr[2], elEndTimeArr[3], elEndTimeArr[4], elEndTimeArr[5]).getTime();

                    for (let row of calendarRows) {
                        let rowColumns = row.getElementsByClassName('calendar_table_event_holder'),
                            index = 0,
                            itemCol = '';

                        for (let col of rowColumns) {
                            if (col.dataset.time) {
                                let dTime = +col.dataset.time,
                                    dTimeEndTime = (dTime + 24 * 60 * 60 * 1000) - 1,
                                    colHtml = col.innerHTML,
                                    colLength = col.getElementsByTagName('a').length + 1;

                                if (dTimeEndTime > elStartTime && elEndTime > dTime) {
                                    let itemName = '';
                                    let fakeItem = '';

                                    if (index == 0) {
                                        itemName = item.Name;
                                        itemCol = colLength;
                                        index++;
                                    }

                                    if (itemCol > colLength) {
                                        for (let i = 0; i < itemCol - colLength; i++) {
                                            fakeItem += '<a class="calendar_table_event clear"></a>'
                                        }
                                    }

                                    col.innerHTML = colHtml + fakeItem + `<a href="${item.Url}" title="${item.Name.replace(/"/gim, '&#34;')}" class="calendar_table_event"><span>${itemName}</span></a>`;
                                }

                                if (elEndTime < dTime) {
                                    break;
                                }
                            }
                        }
                    }
                }

                calendarLoader.style.display = 'none';
            }
        };

        xhttp.open("GET", searchEventUrl, true);
        xhttp.send();

        function getDay(date) {
            var day = date.getDay();
            if (day == 0) day = 7;
            return day - 1;
        }
    }
}(window));
