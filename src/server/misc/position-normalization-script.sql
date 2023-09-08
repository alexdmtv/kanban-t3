
with
tasks_cte as (
    select
        id
        , row_number() over(partition by list_id order by list_position) as norm_position
    from tasks
)

update tasks
set list_position = tasks_cte.norm_position
from tasks_cte
where 1=1
    and tasks.id = tasks_cte.id;


with
lists_cte as (
    select
        id
        , row_number() over(partition by board_id order by board_position) as norm_position
    from lists
)

update lists
set board_position = lists_cte.norm_position
from lists_cte
where 1=1
    and lists.id = lists_cte.id;

with
subtasks_cte as (
    select
        id
        , row_number() over(partition by task_id order by task_position) as norm_position
    from subtasks
)

update subtasks
set task_position = subtasks_cte.norm_position
from subtasks_cte
where 1=1
    and subtasks.id = subtasks_cte.id;